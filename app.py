import os
import uuid
import json
from typing import Dict, List, Any, TypedDict
from flask import Flask, render_template, request, jsonify, session, Response
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from langchain_community.llms import Ollama
from langgraph.graph import StateGraph, START, END

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "ai_financial_coach_future_secret_key_2026")
CORS(app)

# Cache for storing sessions (so chatbot has access to user data)
# Since Flask's cookie-based session might be size-limited, we store it in a simple in-memory dict
SESSION_STORE = {}

# --- 1. State Definition ---
class FinancialState(TypedDict):
    # User Inputs
    name: str
    age: int
    income: float
    expenses: Dict[str, float]
    goal_name: str
    goal_amount: float
    
    # Financial Summary
    total_expenses: float
    remaining_money: float
    saving_rate: float
    expense_percentages: Dict[str, float]
    largest_expense_category: str
    largest_expense_amount: float
    
    # Financial Health Score
    health_score: int
    health_category: str
    
    # Spending Analysis
    spending_analysis_text: str
    
    # Goal Planning
    months_to_goal: float
    goal_analysis: str
    
    # Recommendations
    recommendations: str
    budget_method_suggestion: str
    
    # Final Output Report
    final_report: Dict[str, Any]

# --- 2. LangGraph Workflow Nodes ---

def input_data_node(state: FinancialState) -> Dict[str, Any]:
    """Node 1: Cleans and validates input values."""
    name = state.get("name", "User").strip()
    if not name:
        name = "User"
    try:
        age = int(state.get("age", 25))
    except:
        age = 25
    try:
        income = float(state.get("income", 0.0))
    except:
        income = 0.0
        
    expenses = {}
    for cat, val in state.get("expenses", {}).items():
        try:
            expenses[cat.strip()] = float(val)
        except:
            expenses[cat.strip()] = 0.0
            
    goal_name = state.get("goal_name", "Target Keuangan").strip()
    try:
        goal_amount = float(state.get("goal_amount", 0.0))
    except:
        goal_amount = 0.0
        
    return {
        "name": name,
        "age": age,
        "income": income,
        "expenses": expenses,
        "goal_name": goal_name,
        "goal_amount": goal_amount
    }

def calculate_financial_summary_node(state: FinancialState) -> Dict[str, Any]:
    """Node 2: Calculates total expenses, remaining money, percentages, and largest expense."""
    income = state["income"]
    expenses = state["expenses"]
    
    total_expenses = sum(expenses.values())
    remaining_money = income - total_expenses
    saving_rate = (remaining_money / income * 100) if income > 0 else 0.0
    
    expense_percentages = {}
    for cat, val in expenses.items():
        expense_percentages[cat] = (val / income * 100) if income > 0 else 0.0
        
    largest_expense_category = "Tidak ada"
    largest_expense_amount = 0.0
    if expenses:
        largest_expense_category = max(expenses, key=expenses.get)
        largest_expense_amount = expenses[largest_expense_category]
        
    return {
        "total_expenses": total_expenses,
        "remaining_money": remaining_money,
        "saving_rate": saving_rate,
        "expense_percentages": expense_percentages,
        "largest_expense_category": largest_expense_category,
        "largest_expense_amount": largest_expense_amount
    }

def calculate_health_score_node(state: FinancialState) -> Dict[str, Any]:
    """Node 3: Calculates Financial Health Score (0-100) and category."""
    income = state["income"]
    total_expenses = state["total_expenses"]
    remaining_money = state["remaining_money"]
    saving_rate = state["saving_rate"]
    expenses = state["expenses"]
    expense_percentages = state["expense_percentages"]
    
    # Start with a baseline score of 50
    score = 50
    
    # Factor A: Saving Rate (Max +20 or Min -30)
    if saving_rate >= 30.0:
        score += 20
    elif saving_rate >= 20.0:
        score += 15
    elif saving_rate >= 10.0:
        score += 5
    elif saving_rate >= 0.0:
        score += 0
    else:  # Deficit
        score -= 20
        
    # Factor B: Expense to Income Ratio (Max +15 or Min -15)
    ratio = (total_expenses / income * 100) if income > 0 else 100.0
    if ratio <= 50.0:
        score += 15
    elif ratio <= 70.0:
        score += 10
    elif ratio <= 90.0:
        score += 0
    else:
        score -= 15
        
    # Factor C: Risk items (Non-essential items exceeding healthy thresholds)
    # Entertainment (Hiburan), Shopping (Belanja), Lifestyle. If any > 20% of income, subtract.
    risk_categories = ["hiburan", "belanja", "entertainment", "shopping", "gaya hidup", "lifestyle"]
    has_high_risk = False
    for cat, pct in expense_percentages.items():
        if cat.lower() in risk_categories and pct > 20.0:
            score -= 10
            has_high_risk = True
            
    if not has_high_risk and remaining_money > 0:
        score += 10
        
    # Factor D: Having savings/positive remaining cash
    if remaining_money > 0:
        score += 5
        
    # Bounds checking
    score = max(0, min(100, score))
    
    # Deficit check caps the score
    if remaining_money <= 0:
        score = min(40, score) # Cap at 40 (Buruk)
        
    # Determine Health Category
    if score >= 81:
        category = "Sangat Baik"
    elif score >= 61:
        category = "Baik"
    elif score >= 41:
        category = "Kurang Baik"
    else:
        category = "Buruk"
        
    return {
        "health_score": int(score),
        "health_category": category
    }

def analyze_spending_pattern_node(state: FinancialState) -> Dict[str, Any]:
    """Node 4: Evaluates categories and generates standard spending analysis."""
    largest_cat = state["largest_expense_category"]
    largest_amt = state["largest_expense_amount"]
    largest_pct = state["expense_percentages"].get(largest_cat, 0.0)
    income = state["income"]
    
    analysis_parts = []
    
    if income <= 0:
        analysis_parts.append("Pendapatan Anda tercatat Rp0. Tidak dapat menganalisis rasio pengeluaran.")
    else:
        analysis_parts.append(
            f"Kategori pengeluaran terbesar Anda adalah '{largest_cat}' sebesar Rp{largest_amt:,.0f} "
            f"({largest_pct:.1f}% dari pendapatan bulanan Anda)."
        )
        
        # Check non-essentials
        lifestyle_cats = ["hiburan", "belanja", "entertainment", "shopping", "gaya hidup", "lifestyle"]
        lifestyle_total_pct = 0.0
        lifestyle_total_amt = 0.0
        
        for cat, amt in state["expenses"].items():
            if cat.lower() in lifestyle_cats:
                lifestyle_total_amt += amt
                lifestyle_total_pct += state["expense_percentages"].get(cat, 0.0)
                
        if lifestyle_total_pct > 30.0:
            analysis_parts.append(
                f"Pengeluaran keinginan/gaya hidup Anda (seperti Hiburan/Belanja) cukup tinggi, mencapai "
                f"Rp{lifestyle_total_amt:,.0f} ({lifestyle_total_pct:.1f}% dari pendapatan). "
                f"Ini adalah area utama yang dapat dioptimalkan untuk berhemat."
            )
        elif lifestyle_total_pct > 15.0:
            analysis_parts.append(
                f"Pengeluaran gaya hidup Anda terpantau wajar, yaitu sekitar Rp{lifestyle_total_amt:,.0f} "
                f"({lifestyle_total_pct:.1f}% dari pendapatan)."
            )
            
        if state["remaining_money"] < 0:
            analysis_parts.append(
                "Keuangan Anda saat ini berada dalam kondisi defisit. Pengeluaran bulanan melebihi pendapatan. "
                "Harap segera kurangi pengeluaran non-primer untuk menghindari penumpukan hutang."
            )
        elif state["saving_rate"] < 10.0:
            analysis_parts.append(
                "Saving rate Anda berada di bawah 10%. Meskipun tidak defisit, kondisi keuangan ini "
                "cukup rentan jika terjadi keadaan darurat."
            )
            
    spending_analysis_text = " ".join(analysis_parts)
    return {
        "spending_analysis_text": spending_analysis_text
    }

def goal_planning_node(state: FinancialState) -> Dict[str, Any]:
    """Node 5: Calculates goal feasibility and time to achieve target."""
    goal_name = state["goal_name"]
    goal_amount = state["goal_amount"]
    remaining_money = state["remaining_money"]
    income = state["income"]
    
    if goal_amount <= 0:
        return {
            "months_to_goal": 0.0,
            "goal_analysis": "Anda tidak memasukkan target keuangan atau nilainya Rp0."
        }
        
    if remaining_money <= 0:
        months_to_goal = -1.0  # Impossible under current state
        goal_analysis = (
            f"Di bawah kondisi keuangan saat ini (tidak ada sisa uang bulanan), target Anda untuk "
            f"membeli '{goal_name}' seharga Rp{goal_amount:,.0f} TIDAK MUNGKIN tercapai. "
            f"Anda harus menyisihkan anggaran atau mencari pendapatan tambahan untuk mulai menabung."
        )
    else:
        months_to_goal = goal_amount / remaining_money
        # If months is fractional, e.g. 6.1, we could say about 6 or 7 months.
        rounded_months = round(months_to_goal, 1)
        ceil_months = int(months_to_goal) if months_to_goal.is_integer() else int(months_to_goal) + 1
        
        goal_analysis = (
            f"Dengan mengalokasikan seluruh sisa uang bulanan sebesar Rp{remaining_money:,.0f} "
            f"ke dalam tabungan target, Anda diperkirakan dapat mencapai target '{goal_name}' "
            f"(Rp{goal_amount:,.0f}) dalam waktu sekitar {rounded_months} bulan (atau dibulatkan menjadi {ceil_months} bulan)."
        )
        
    return {
        "months_to_goal": months_to_goal,
        "goal_analysis": goal_analysis
    }

def llm_recommendation_node(state: FinancialState) -> Dict[str, Any]:
    """Node 6: Leverages Ollama (gemma3:4b) to build futuristic, actionable advice."""
    income = state["income"]
    total_expenses = state["total_expenses"]
    remaining_money = state["remaining_money"]
    saving_rate = state["saving_rate"]
    largest_cat = state["largest_expense_category"]
    largest_amt = state["largest_expense_amount"]
    largest_pct = state["expense_percentages"].get(largest_cat, 0.0)
    
    # Format expenses list
    expenses_breakdown = ""
    for cat, amt in state["expenses"].items():
        pct = state["expense_percentages"].get(cat, 0.0)
        expenses_breakdown += f"- {cat}: Rp{amt:,.0f} ({pct:.1f}%)\n"
        
    needs_50 = 0.5 * income
    wants_30 = 0.3 * income
    savings_20 = 0.2 * income
    
    recommendation_prompt = """
Anda adalah AI Financial Coach, pakar perencanaan keuangan pribadi yang futuristik, analitis, dan bijaksana.
Tugas Anda adalah memberikan analisis mendalam dan rekomendasi finansial yang terpersonalisasi berdasarkan profil keuangan pengguna berikut:

Nama: {name}
Umur: {age} tahun
Pendapatan per Bulan: Rp{income:,.0f}
Total Pengeluaran: Rp{total_expenses:,.0f}
Sisa Uang (Tabungan): Rp{remaining_money:,.0f}
Saving Rate: {saving_rate:.1f}%
Kategori Pengeluaran Terbesar: {largest_expense_category} (Rp{largest_expense_amount:,.0f} atau {largest_expense_percentage:.1f}% dari pendapatan)
Daftar Lengkap Pengeluaran:
{expenses_breakdown}

Skor Kesehatan Finansial: {health_score}/100 ({health_category})
Analisis Pola Pengeluaran: {spending_analysis_text}

Target Keuangan: {goal_name} seharga Rp{goal_amount:,.0f}
Estimasi Pencapaian Target: {months_to_goal:.1f} bulan (dengan menabung seluruh sisa uang Rp{remaining_money:,.0f}/bulan)

Berikan laporan analisis yang memukau dan profesional dalam bahasa Indonesia. Rekomendasi harus mencakup:
1. Evaluasi Umum: Berikan penilaian singkat mengenai kondisi keuangan saat ini dengan nada memotivasi.
2. Pembagian Anggaran Ideal (Metode 50/30/20):
   - 50% untuk kebutuhan pokok (Rp{needs_50:,.0f})
   - 30% untuk keinginan/gaya hidup (Rp{wants_30:,.0f})
   - 20% untuk tabungan/investasi (Rp{savings_20:,.0f})
   Bandingkan dengan alokasi pengeluaran mereka saat ini dan tunjukkan di mana mereka harus melakukan penyesuaian.
3. Strategi Penghematan & Optimalisasi:
   - Berikan 3 langkah konkret yang dapat diambil untuk memotong pengeluaran berlebih (terutama pada kategori {largest_expense_category} atau kategori lainnya).
   - Tunjukkan bagaimana penghematan ini dapat mempercepat pencapaian target mereka ({goal_name}).
4. Rencana Aksi Target Keuangan ({goal_name}):
   - Berikan alternatif skenario menabung (misal: jika menyisihkan 20% pendapatan vs. kondisi saat ini).
   - Berikan tips investasi sederhana atau tempat menyimpan tabungan target (misal: Reksadana Pasar Uang atau Deposito) agar uang bertumbuh.

Pastikan respons Anda menggunakan format Markdown yang rapi, bersih, dengan poin-poin yang mudah dibaca. Gunakan gaya bahasa yang ramah, futuristik (menggunakan istilah seperti 'optimalisasi sistem', 'efisiensi energi keuangan', atau 'analisis algoritma finansial' secara halus), namun tetap realistis dan profesional.
"""
    
    prompt = recommendation_prompt.format(
        name=state["name"],
        age=state["age"],
        income=income,
        total_expenses=total_expenses,
        remaining_money=remaining_money,
        saving_rate=saving_rate,
        largest_expense_category=largest_cat,
        largest_expense_amount=largest_amt,
        largest_expense_percentage=largest_pct,
        expenses_breakdown=expenses_breakdown,
        health_score=state["health_score"],
        health_category=state["health_category"],
        spending_analysis_text=state["spending_analysis_text"],
        goal_name=state["goal_name"],
        goal_amount=state["goal_amount"],
        months_to_goal=state["months_to_goal"],
        needs_50=needs_50,
        wants_30=wants_30,
        savings_20=savings_20
    )
    
    try:
        # Temperature 0.2 for stability
        llm = Ollama(model="gemma3:4b", temperature=0.2)
        recommendations = llm.invoke(prompt)
    except Exception as e:
        print("Error calling Ollama:", str(e))
        recommendations = (
            "### Analisis & Rekomendasi Terganggu\n"
            "Sistem mengalami gangguan dalam memproses rekomendasi LLM. Rangkuman data Anda tetap aman:\n"
            f"- **Nama**: {state['name']}\n"
            f"- **Skor Kesehatan**: {state['health_score']}/100 ({state['health_category']})\n"
            f"- **Kategori Terbesar**: {largest_cat} (Rp{largest_amt:,.0f})\n"
            "- **Saran Dasar**: Cobalah membatasi pengeluaran non-primer Anda di bawah 30% dan alokasikan minimal 20% untuk tabungan."
        )
        
    budget_method_suggestion = (
        f"Berdasarkan alokasi anggaran ideal 50/30/20:\n"
        f"- Kebutuhan Pokok (50%): Rp{needs_50:,.0f}\n"
        f"- Keinginan (30%): Rp{wants_30:,.0f}\n"
        f"- Tabungan/Target (20%): Rp{savings_20:,.0f}\n\n"
        f"Alokasi saat ini: Anda membelanjakan {100 - saving_rate:.1f}% untuk pengeluaran dan menyisihkan {saving_rate:.1f}% sebagai tabungan."
    )
    
    return {
        "recommendations": recommendations,
        "budget_method_suggestion": budget_method_suggestion
    }

def generate_final_report_node(state: FinancialState) -> Dict[str, Any]:
    """Node 7: Compiles all values to return a unified report structured object."""
    final_report = {
        "name": state["name"],
        "age": state["age"],
        "income": state["income"],
        "expenses": state["expenses"],
        "total_expenses": state["total_expenses"],
        "remaining_money": state["remaining_money"],
        "saving_rate": state["saving_rate"],
        "expense_percentages": state["expense_percentages"],
        "largest_expense_category": state["largest_expense_category"],
        "largest_expense_amount": state["largest_expense_amount"],
        "health_score": state["health_score"],
        "health_category": state["health_category"],
        "spending_analysis_text": state["spending_analysis_text"],
        "months_to_goal": state["months_to_goal"],
        "goal_name": state["goal_name"],
        "goal_amount": state["goal_amount"],
        "goal_analysis": state["goal_analysis"],
        "recommendations": state["recommendations"],
        "budget_method_suggestion": state["budget_method_suggestion"]
    }
    return {
        "final_report": final_report
    }

# --- 3. Construct the StateGraph ---
workflow = StateGraph(FinancialState)

workflow.add_node("input_data", input_data_node)
workflow.add_node("summary", calculate_financial_summary_node)
workflow.add_node("health_score", calculate_health_score_node)
workflow.add_node("spending_analysis", analyze_spending_pattern_node)
workflow.add_node("goal_planning", goal_planning_node)
workflow.add_node("llm_recommendation", llm_recommendation_node)
workflow.add_node("final_report", generate_final_report_node)

# Set edges flow
workflow.add_edge(START, "input_data")
workflow.add_edge("input_data", "summary")
workflow.add_edge("summary", "health_score")
workflow.add_edge("health_score", "spending_analysis")
workflow.add_edge("spending_analysis", "goal_planning")
workflow.add_edge("goal_planning", "llm_recommendation")
workflow.add_edge("llm_recommendation", "final_report")
workflow.add_edge("final_report", END)

# Compile LangGraph app
langgraph_app = workflow.compile()


# --- 4. Web Application Routes ---

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/analyze", methods=["POST"])
def analyze():
    """Trigger the LangGraph workflow and save results for chat context."""
    try:
        data = request.json
        if not data:
            return jsonify({"status": "error", "message": "Payload JSON kosong"}), 400
            
        # Extract inputs from request
        initial_state = {
            "name": data.get("name", "User"),
            "age": data.get("age", 25),
            "income": data.get("income", 0.0),
            "expenses": data.get("expenses", {}),
            "goal_name": data.get("goal_name", "Tabungan"),
            "goal_amount": data.get("goal_amount", 0.0)
        }
        
        # Execute the compiled LangGraph
        result_state = langgraph_app.invoke(initial_state)
        report = result_state["final_report"]
        
        # Create or retrieve session ID
        session_id = session.get("session_id")
        if not session_id:
            session_id = str(uuid.uuid4())
            session["session_id"] = session_id
            
        # Store report & initialize chat history
        SESSION_STORE[session_id] = {
            "report": report,
            "chat_history": []
        }
        
        return jsonify({
            "status": "success",
            "data": report
        })
        
    except Exception as e:
        print("Analysis Error:", str(e))
        return jsonify({"status": "error", "message": f"Terjadi kesalahan saat analisis: {str(e)}"}), 500

@app.route("/api/chat", methods=["POST"])
def chat():
    """Stream chatbot responses referencing the current user profile."""
    try:
        data = request.json
        user_message = data.get("message", "").strip()
        if not user_message:
            return jsonify({"status": "error", "message": "Pesan kosong"}), 400
            
        session_id = session.get("session_id")
        if not session_id or session_id not in SESSION_STORE:
            # Fallback message if no data exists
            def generate_fallback():
                fallback_msg = (
                    "Halo! Saya adalah AI Financial Coach Anda. "
                    "Silakan isi data keuangan Anda terlebih dahulu pada formulir di sebelah kiri "
                    "agar saya dapat memproses profil keuangan Anda dan memberikan bimbingan yang tepat."
                )
                yield f"data: {json.dumps({'content': fallback_msg})}\n\n"
                yield "data: [DONE]\n\n"
            return Response(generate_fallback(), mimetype="text/event-stream")
            
        user_data = SESSION_STORE[session_id]
        report = user_data["report"]
        chat_history = user_data["chat_history"]
        
        # Build expenses breakdown text for chat context
        expenses_breakdown = ""
        for cat, amt in report["expenses"].items():
            pct = report["expense_percentages"].get(cat, 0.0)
            expenses_breakdown += f"- {cat}: Rp{amt:,.0f} ({pct:.1f}%)\n"
            
        # Limit history size to keep LLM context clean
        history_text = ""
        for chat_round in chat_history[-6:]:
            history_text += f"User: {chat_round['user']}\nCoach: {chat_round['coach']}\n"
            
        # Futuristic Financial Coach Prompt
        system_prompt = f"""
Anda adalah AI Financial Coach, asisten keuangan pribadi masa depan yang cerdas, strategis, dan interaktif.
Anda berbicara dengan {report['name']} (Umur {report['age']}).
Berikut adalah data keuangan pengguna untuk analisis Anda:
- Pendapatan: Rp{report['income']:,.0f} per bulan
- Total Pengeluaran: Rp{report['total_expenses']:,.0f} per bulan
- Sisa Uang (Tabungan): Rp{report['remaining_money']:,.0f} per bulan (Saving Rate: {report['saving_rate']:.1f}%)
- Skor Kesehatan Finansial: {report['health_score']}/100 ({report['health_category']})
- Pengeluaran Terbesar: {report['largest_expense_category']} (Rp{report['largest_expense_amount']:,.0f})
- Daftar Pengeluaran:
{expenses_breakdown}
- Target Keuangan: Membeli {report['goal_name']} seharga Rp{report['goal_amount']:,.0f}
- Rencana Target: Estimasi tercapai dalam {report['months_to_goal']:.1f} bulan dengan tabungan saat ini.
- Rekomendasi Awal: {report['recommendations']}

Aturan Percakapan:
1. Jawablah pertanyaannya dengan ramah, taktis, suportif, dan memberikan solusi yang dapat dipraktikkan berdasarkan profil keuangannya di atas.
2. Gunakan bahasa Indonesia yang santun, profesional, dengan sedikit sentuhan futuristik/AI (seperti menggunakan istilah 'sistem pengeluaran', 'algoritma tabungan', 'efisiensi anggaran').
3. Buat jawaban Anda ringkas, langsung pada poin masalah, dan tidak terlalu panjang (jangan ulangi seluruh isi rekomendasi kecuali diminta).
4. Jika pengguna bertanya hal di luar finansial, kembalikan percakapan secara halus ke arah manajemen keuangan pribadi.

Riwayat percakapan sebelumnya:
{history_text}

Pertanyaan Pengguna: {user_message}
Jawaban Coach AI:
"""
        
        def sse_generate():
            try:
                llm = Ollama(model="gemma3:4b", temperature=0.3)
                full_reply = ""
                # Stream the responses
                for chunk in llm.stream(system_prompt):
                    full_reply += chunk
                    yield f"data: {json.dumps({'content': chunk})}\n\n"
                    
                # Append to chat history
                chat_history.append({"user": user_message, "coach": full_reply})
                SESSION_STORE[session_id]["chat_history"] = chat_history
                
            except Exception as ex:
                err_msg = f"\n[Sistem Coach mendeteksi gangguan jaringan: {str(ex)}]"
                yield f"data: {json.dumps({'content': err_msg})}\n\n"
                
            yield "data: [DONE]\n\n"
            
        return Response(sse_generate(), mimetype="text/event-stream")
        
    except Exception as e:
        print("Chat API Error:", str(e))
        return jsonify({"status": "error", "message": f"Terjadi kesalahan di server chat: {str(e)}"}), 500

@app.route("/api/reset", methods=["POST"])
def reset():
    """Reset the current session analysis."""
    session_id = session.get("session_id")
    if session_id and session_id in SESSION_STORE:
        del SESSION_STORE[session_id]
    session.clear()
    return jsonify({"status": "success", "message": "Sistem berhasil di-reset"})

if __name__ == "__main__":
    # Ensure port 5000 is open and runs locally
    app.run(host="127.0.0.1", port=5000, debug=True)

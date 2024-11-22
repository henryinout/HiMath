import React, { useEffect, useState } from "react";
import Dropdown from "../components/Dropdown";
import Timer from "../components/Timer";
import QuestionCard from "../components/QuestionCard";
import axios from "axios";
import "./styles.css";

const Exam = () => {
    const [questions, setQuestions] = useState({});
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [answer, setAnswer] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            alert("您需要先登录！");
            window.location.href = "/login";
        } else {
            fetchQuestions();
        }
    }, [token]);

    const fetchQuestions = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/questions", {
                headers: { Authorization: token },
            });
            setQuestions(response.data);
            setSelectedQuestionId(Object.keys(response.data)[0]); // 默认选择第一题
        } catch (error) {
            alert("无法加载题目，请稍后再试！");
        }
    };

    const handleSubmitAnswer = async () => {
        if (!answer.trim()) {
            alert("请输入答案！");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:3000/api/submit",
                {
                    questionId: selectedQuestionId,
                    answer,
                },
                {
                    headers: { Authorization: token },
                }
            );
            alert(response.data.correct ? "答案正确！" : "答案错误，请再试一次！");
            setAnswer("");
        } catch (error) {
            alert("提交失败，请稍后再试！");
        }
    };

    const handleTimeUp = () => {
        alert("时间到了！");
    };

    const selectedQuestion = questions[selectedQuestionId];

    return (
        <div>
            <header className="bg-primary text-white py-3">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="fs-4 m-0">HiMath Team Round</h1>
                    <Timer durationInSeconds={32 * 60 + 49} onTimeUp={handleTimeUp} />
                </div>
            </header>

            <div className="container-fluid mt-3">
                <div className="row">
                    <div className="col-lg-8 col-md-7">
                        <Dropdown
                            questions={questions}
                            onSelectQuestion={setSelectedQuestionId}
                        />
                        <QuestionCard question={selectedQuestion} />
                        <div>
                            <input
                                type="text"
                                className="form-control mb-2"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="请输入答案"
                            />
                            <button className="btn btn-success" onClick={handleSubmitAnswer}>
                                提交答案
                            </button>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-5 bg-light d-flex justify-content-center align-items-center">
                        <p className="text-muted">聊天室功能开发中...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Exam;
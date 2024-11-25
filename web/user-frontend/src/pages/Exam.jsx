// src/pages/Exam.jsx

import React, { useEffect, useState } from "react";
import Dropdown from "../components/Dropdown";
import Timer from "../components/Timer";
import QuestionCard from "../components/QuestionCard";
import AnswerHistory from "../components/AnswerHistory";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/styles.css";

const Exam = () => {
    const { competitionId } = useParams(); // 获取 URL 参数
    const [competition, setCompetition] = useState(null); // 添加竞赛详情状态
    const [questions, setQuestions] = useState([]);
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [answers, setAnswers] = useState({});
    const [answerInput, setAnswerInput] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                alert("您需要先登录！");
                navigate("/login");
                return;
            }
            if (!competitionId) {
                alert("无效的竞赛ID！");
                navigate("/competitions");
                return;
            }

            await fetchCompetition();
            await fetchQuestions();
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, competitionId]);

    // 从后台获取竞赛详情
    const fetchCompetition = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/competitions/${competitionId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("竞赛详情响应：", response.data); // 调试日志
            setCompetition(response.data.competition); // 只设置竞赛详情
        } catch (error) {
            console.error("无法加载竞赛详情：", error);
            alert("无法加载竞赛详情，请稍后再试！");
            navigate("/competitions");
        }
    };

    // 从后台获取题目
    const fetchQuestions = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/competitions/${competitionId}/questions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("竞赛题目响应：", response.data); // 调试日志
            // 假设后台返回的是一个数组
            setQuestions(response.data);
            if (response.data.length > 0) {
                setSelectedQuestionId(response.data[0]._id); // 默认选择第一题
            } else {
                alert("该竞赛没有题目。");
                navigate("/competitions");
            }
        } catch (error) {
            console.error("无法加载题目：", error);
            alert("无法加载题目，请稍后再试！");
            navigate("/competitions");
        }
    };

    // 实时提交答案
    const handleSubmitAnswer = async () => {
        if (!answerInput.trim()) {
            alert("请输入答案！");
            return;
        }

        if (!selectedQuestionId) {
            alert("请选择一个题目！");
            return;
        }

        const currentAnswer = {
            questionId: selectedQuestionId,
            answer: answerInput.trim(),
            timestamp: new Date().toISOString(),
        };

        try {
            await axios.post(
                "http://localhost:3000/api/submit",
                currentAnswer,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // 本地保存提交记录
            setAnswers((prevAnswers) => ({
                ...prevAnswers,
                [selectedQuestionId]: [
                    ...(prevAnswers[selectedQuestionId] || []),
                    currentAnswer,
                ],
            }));

            setAnswerInput(""); // 清空答案输入框
            alert("答案已提交！");
        } catch (error) {
            console.error("提交失败：", error);
            alert("提交失败，请稍后再试！");
        }
    };

    const handleTimeUp = () => {
        alert("时间到了，正在提交考试...");
        // 由于已移除 finalSubmit 功能，这里可以根据需求进行相应处理
        // 例如自动保存当前答案或跳转到结果页面
    };

    const selectedQuestion = questions.find(q => q._id === selectedQuestionId);

    return (
        <div>
            {/* Header Section */}
            <header className="bg-primary text-white py-3">
                <div className="container d-flex justify-content-between align-items-center">
                    <h1 className="fs-4 m-0">{competition ? competition.name : "加载中..."}</h1>
                    <Timer durationInSeconds={32 * 60 + 49} onTimeUp={handleTimeUp} />
                </div>
            </header>

            {/* Main Content Section */}
            <div className="container-fluid mt-3">
                <div className="row">
                    {/* Left Panel - 答题区域 */}
                    <div className="col-lg-8 col-md-7">
                        {/* Dropdown for selecting questions */}
                        <Dropdown
                            questions={questions}
                            onSelectQuestion={setSelectedQuestionId}
                            selectedQuestionId={selectedQuestionId}
                        />

                        {/* Question Area */}
                        {selectedQuestion ? (
                            <QuestionCard question={selectedQuestion} />
                        ) : (
                            <p>加载中...</p>
                        )}

                        {/* Answer Area */}
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control mb-2"
                                value={answerInput}
                                onChange={(e) => setAnswerInput(e.target.value)}
                                placeholder="请输入答案"
                            />
                            <button className="btn btn-success" onClick={handleSubmitAnswer}>
                                提交答案
                            </button>
                        </div>

                        {/* Answer History */}
                        <AnswerHistory history={answers[selectedQuestionId]} />
                    </div>

                    {/* Right Panel - 聊天模块（未开发） */}
                    <div className="col-lg-4 col-md-5 bg-light d-flex flex-column justify-content-center align-items-center">
                        <div className="chat-placeholder text-center">
                            <h5>聊天室功能开发中...</h5>
                            {/* 占位符图标 */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="100"
                                height="100"
                                fill="currentColor"
                                className="bi bi-chat-left-dots"
                                viewBox="0 0 16 16"
                            >
                                <path d="M14 1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4.414a2 2 0 0 0-1.414.586L1 15l1.586-1.414A2 2 0 0 0 4.414 13H14a1 1 0 0 1 1-1V2a1 1 0 0 1 1-1zM14 13H4.414a1 1 0 0 1-.707-.293L2 11.414V2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v9z" />
                                <path d="M5 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default Exam;
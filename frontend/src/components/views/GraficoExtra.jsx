import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import * as echarts from "echarts";
import "echarts/lib/component/tooltip";
import "../../css/grafico.css";
import NotesButton from "./NotesButton";
import axios from 'axios';

function GraficoExtra() {
    const [offers, setOffers] = useState([]);
    const [showLabels, setShowLabels] = useState(false); 
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
        fetchOffers();
    }, []);

    useEffect(() => {
        if (chartInstance) {
            processData();
        }
    }, [offers, showLabels]); 

    const fetchOffers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}offers`);
            const sortedOffers = response.data.offers.sort((a, b) => new Date(a.date) - new Date(b.date));
            setOffers(sortedOffers);
        } catch (error) {
            console.error('Error fetching offers:', error);
        }
    };

    useEffect(() => {
        initChart2();
    }, []);

    const processData = () => {
        if (offers && offers.length > 0 && chartInstance) {
            const dates = [];
            const varieties = {};

            offers.forEach((offer) => {
                const date = new Date(offer.date);
                const month = date.toLocaleString("default", { month: "long" });
                const day = date.getDate();
                const key = `${month} ${day}`;

                if (!dates.includes(key)) {
                    dates.push(key);
                }

                const productName = `${offer.product.name} - ${offer.product.variety.name}`;
                if (!varieties[productName]) {
                    varieties[productName] = [];
                }

                if (!isNaN(offer.price)) {
                    varieties[productName].push({ value: offer.price, date: key });
                }
            });

            const seriesData = Object.entries(varieties).map(([productName, prices]) => ({
                name: productName,
                type: "line",
                data: prices,
                symbol: "circle",
                symbolSize: 10,
                itemStyle: {
                    emphasis: {
                        borderColor: "rgba(0,0,0,0.5)",
                        borderWidth: 2,
                    },
                },
                label: {
                    show: showLabels, 
                    formatter: (params) => `${params.value}`,
                    position: "top",
                },
            }));

            const option = {
                color: ["#D96A8D", "#3A99D9", "#FFD700", "#7CFC00"],
                tooltip: {
                    show: true,
                    trigger: "axis",
                },
                legend: {
                    data: seriesData.map((series) => series.name),
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true,
                },
                xAxis: [
                    {
                        type: "category",
                        boundaryGap: false,
                        data: dates,
                        axisLine: { show: false },
                        axisTick: { show: false },
                        axisPointer: { type: "shadow" },
                    },
                ],
                yAxis: [
                    {
                        type: "value",
                    },
                ],
                series: seriesData,
            };

            chartInstance.setOption(option);
        }
    };

    const initChart2 = () => {
        const chart = echarts.init(document.getElementById("chart2"));
        setChartInstance(chart);
        window.addEventListener("resize", () => {
            chart.resize();
        });
    };

    const toggleLabels = () => {
        setShowLabels(!showLabels); 
    };

    return (
        <div className="container-fluid">
            <div id="chart2" className="chart"></div>
            <div className="w-100 d-flex gap-3 py-5">
                <NotesButton type={"noticia"} />
                <NotesButton type={"negociacion"} />
                <button className="btn btn-primary" style={{ backgroundColor: "#70aa68", border: "none" }} onClick={toggleLabels}>Información</button>
            </div>
        </div>
    );
}

export default GraficoExtra;

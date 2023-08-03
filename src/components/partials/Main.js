import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/partials/Style.css';

const Main = () => {
    return (
        <div class="sb-nav-fixed mainpage">
            <div id="layoutSidenav">
                <div id="layoutSidenav_content">
                    <main>
                        <div class="container-fluid px-4">
                            <h1 class="mt-4">수정필요</h1>
                            <ol class="breadcrumb mb-4">
                                <li class="breadcrumb-item active">수정필요</li>
                            </ol>
                            <div class="row">
                                <div class="col-xl-3 col-md-6">
                                    <div class="card bg-primary text-white mb-4">
                                        <div class="card-body">Primary Card</div>
                                        <div class="card-footer d-flex align-items-center justify-content-between">
                                            <a class="small text-white stretched-link" href="#">View Details</a>
                                            <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-xl-6">
                                    <div class="card mb-4">
                                        <div class="card-header">
                                            <i class="fas fa-chart-area me-1"></i>
                                            화상채팅
                                        </div>
                                        <div class="card-body"></div>
                                    </div>
                                </div>
                                <div class="col-xl-6">
                                    <div class="card mb-4">
                                        <div class="card-header">
                                            <i class="fas fa-chart-bar me-1"></i>
                                            오늘의 생활지식
                                        </div>
                                        <div class="card-body"></div>
                                    </div>
                                </div>
                                <div class="col-xl-6">
                                    <div class="card mb-4">
                                        <div class="card-header">
                                            <i class="fas fa-chart-area me-1"></i>
                                            소모임
                                        </div>
                                        <div class="card-body"></div>
                                    </div>
                                </div>
                                <div class="col-xl-6">
                                    <div class="card mb-4">
                                        <div class="card-header">
                                            <i class="fas fa-chart-area me-1"></i>
                                            Area Chart Example
                                        </div>
                                        <div class="card-body"></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </main>

                </div>
            </div>
        </div>
    );
};

export default Main;
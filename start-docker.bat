@echo off

REM 摸鱼资讯项目 Docker 启动脚本（Windows版）

REM 显示帮助信息
if "%1"=="--help" goto show_help
if "%1"=="-h" goto show_help

REM 检查 Docker 是否已安装
docker --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未安装 Docker。请先安装 Docker 和 Docker Compose。
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未安装 Docker Compose。请先安装 Docker Compose。
    pause
    exit /b 1
)

REM 处理命令行参数
if "%1"=="--build" goto build_and_start
if "%1"=="--pull" goto pull_and_start
if "%1"=="--stop" goto stop_service
if "%1"=="--logs" goto view_logs

REM 默认启动
:start_default
    echo 正在启动服务...
    docker-compose up -d
    echo 服务已启动。访问 http://localhost:3636 查看应用。
    echo 使用 "%~nx0 --help" 查看更多选项。
    pause
    exit /b 0

:build_and_start
    echo 正在构建镜像并启动服务...
    docker-compose -f docker-compose.yml -f docker-compose.build.yml up -d --build
    echo 服务已启动。访问 http://localhost:3636 查看应用。
    echo 使用 "%~nx0 --logs" 查看日志。
    pause
    exit /b 0

:pull_and_start
    echo 正在从云仓库拉取镜像并启动服务...
    docker-compose pull
    docker-compose up -d
    echo 服务已启动。访问 http://localhost:3636 查看应用。
    echo 使用 "%~nx0 --logs" 查看日志。
    pause
    exit /b 0

:stop_service
    echo 正在停止服务...
    docker-compose down
    echo 服务已停止。
    pause
    exit /b 0

:view_logs
    echo 查看服务日志 (按 Ctrl+C 后输入 Y 退出)...
    docker-compose logs -f
    pause
    exit /b 0

:show_help
    echo 用法: %~nx0 [选项]
    echo 选项:
    echo   --build    构建镜像并启动服务
    echo   --pull     从云仓库拉取镜像并启动服务
    echo   --stop     停止服务
    echo   --logs     查看服务日志
    echo   --help     显示帮助信息
    pause
    exit /b 0
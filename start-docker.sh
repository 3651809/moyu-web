#!/bin/bash

# 摸鱼资讯项目 Docker 启动脚本

# 显示帮助信息
show_help() {
    echo "用法: $0 [选项]"
    echo "选项:"
    echo "  --build    构建镜像并启动服务"
    echo "  --pull     从云仓库拉取镜像并启动服务"
    echo "  --stop     停止服务"
    echo "  --logs     查看服务日志"
    echo "  --help     显示帮助信息"
    exit 0
}

# 检查 Docker 是否已安装
check_docker() {
    if ! command -v docker &> /dev/null
    then
        echo "错误: 未安装 Docker。请先安装 Docker 和 Docker Compose。"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null
    then
        echo "错误: 未安装 Docker Compose。请先安装 Docker Compose。"
        exit 1
    fi
}

# 构建镜像并启动服务
build_and_start() {
    echo "正在构建镜像并启动服务..."
    docker-compose -f docker-compose.yml -f docker-compose.build.yml up -d --build
    echo "服务已启动。访问 http://localhost:3636 查看应用。"
    echo "使用 '$0 --logs' 查看日志。"
}

# 从云仓库拉取镜像并启动服务
pull_and_start() {
    echo "正在从云仓库拉取镜像并启动服务..."
    docker-compose pull
    docker-compose up -d
    echo "服务已启动。访问 http://localhost:3636 查看应用。"
    echo "使用 '$0 --logs' 查看日志。"
}

# 停止服务
stop_service() {
    echo "正在停止服务..."
    docker-compose down
    echo "服务已停止。"
}

# 查看服务日志
view_logs() {
    echo "查看服务日志 (按 Ctrl+C 退出)..."
    docker-compose logs -f
}

# 主函数
main() {
    check_docker
    
    case "$1" in
        --build)
            build_and_start
            ;;
        --pull)
            pull_and_start
            ;;
        --stop)
            stop_service
            ;;
        --logs)
            view_logs
            ;;
        --help | -h)
            show_help
            ;;
        *)
            echo "正在启动服务..."
            docker-compose up -d
            echo "服务已启动。访问 http://localhost:3636 查看应用。"
            echo "使用 '$0 --help' 查看更多选项。"
            ;;
    esac
}

# 执行主函数
main "$@"
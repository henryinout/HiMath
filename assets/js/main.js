// 使用 cytoscape-dagre 插件
cytoscape.use(cytoscapeDagre);

// 使用 jQuery 的 $.getJSON 来加载 elements.json 文件
$.getJSON('elements.json', function (data) {
    // 创建 Cytoscape 图
    var cy = cytoscape({
        container: $('#cy')[0], // HTML 容器
        elements: [...data.nodes, ...data.edges], // 从 JSON 加载节点和边
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#6fb1fc', // 初始背景颜色
                    'label': 'data(label)',
                    'width': 40, // 初始宽度
                    'height': 40, // 初始高度
                    'transition-property': 'background-color, width, height', // 过渡属性
                    'transition-duration': '0.2s' // 过渡持续时间 0.2 秒
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 4,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle',
                    'line-style': 'solid',
                    'curve-style': 'bezier', // 使用贝塞尔曲线
                    'transition-property': 'line-color, width, line-style, target-arrow-color', // 定义过渡效果
                    'transition-duration': '0.5s', // 过渡持续时间 0.5 秒
                }
            },
            {
                selector: '.highlighted-edge', // 定义传输时的边样式
                style: {
                    'width': 4, // 保持原始宽度
                    'line-color': '#1F1E33', // 设置红色
                    'line-style': 'dashed', // 设置线条为虚线以模拟传输
                    'target-arrow-color': '#1F1E33',
                    'line-dash-pattern': [20, 10], // 设置虚线的模式（长度为10，间隙为4）
                    'line-dash-offset': 0 // 初始偏移量
                }
            }
        ],
        layout: {
            name: 'dagre',
            rankDir: 'LR',  // 从左到右排列
            edgeSep: 50,    // 控制边之间的间距
            rankSep: 100,   // 控制层级之间的距离
            nodeSep: 50     // 控制节点之间的间距
        }
    });

    // 模态框逻辑
    var $modal = $('#modal');
    var $modalTitle = $('#modal-title');
    var $modalBody = $('#modal-body');
    var $span = $('.close');

    // 当鼠标悬浮到节点上时，节点缓缓变大，并变为红色
    cy.on('mouseover', 'node', function (evt) {
        var node = evt.target;
        node.animate({
            style: {
                'background-color': '#1F1E33', // 红色
                'width': 60,  // 变大
                'height': 60  // 变大
            },
            duration: 200  // 动画持续时间 200 毫秒
        });
    });

    // 当鼠标移出节点时，还原为原来的样式
    cy.on('mouseout', 'node', function (evt) {
        var node = evt.target;
        node.animate({
            style: {
                'background-color': '#6fb1fc', // 还原为蓝色
                'width': 40,  // 恢复原始宽度
                'height': 40  // 恢复原始高度
            },
            duration: 200  // 动画持续时间 200 毫秒
        });
    });

    // 点击节点事件：显示模态框
    cy.on('tap', 'node', function (evt) {
        var node = evt.target;
        $modalTitle.text(node.data('label'));
        $modalBody.text('Information about ' + node.data('label'));
        $modal.fadeIn(200); // 200 毫秒的淡入动画
    });

    // 点击 x 按钮关闭模态框
    $span.on('click', function () {
        $modal.fadeOut(200); // 200 毫秒的淡出动画
    });

    // 点击模态框外部关闭模态框
    $(window).on('click', function (event) {
        if ($(event.target).is($modal)) {
            $modal.fadeOut(200); // 200 毫秒的淡出动画
        }
    });

    // 存储边动画定时器
    var edgeTimers = {};

    // 当鼠标悬浮在边上时，进行传输动画
    cy.on('mouseover', 'edge', function (evt) {
        var edge = evt.target;
        edge.addClass('highlighted-edge'); // 添加样式

        var dashOffset = 0; // 虚线初始偏移量
        var dashPatternLength = 30; // 虚线模式的总长度（10 + 4）

        // 启动动画定时器
        edgeTimers[edge.id()] = setInterval(function () {
            // 更新虚线的偏移量，使虚线看起来在移动
            dashOffset += 1; // 每次偏移量加1，可以调节速度

            // 如果偏移量超过虚线模式的总长度，则重置偏移量
            if (dashOffset > dashPatternLength) {
                dashOffset = 0; // 重置偏移量，继续循环
            }

            // 设置新的偏移量
            edge.style('line-dash-offset', -dashOffset);
        }, 10); // 每 10 毫秒更新一次
    });

    // 鼠标移出边时，恢复原来的样式并清除动画
    cy.on('mouseout', 'edge', function (evt) {
        var edge = evt.target;
        edge.removeClass('highlighted-edge'); // 移除样式
        clearInterval(edgeTimers[edge.id()]); // 清除定时器
        delete edgeTimers[edge.id()]; // 删除定时器记录

        // 恢复原始样式
        edge.style({
            'line-dash-offset': 0 // 恢复偏移量
        });
    });

}).fail(function (error) {
    console.error('Error loading elements:', error);
});

// 使用 cytoscape-dagre 插件
cytoscape.use(cytoscapeDagre);
var $courseBox = $('#course-box');

$courseBox.hide(); 

var isCourseBoxOpen = false;


var $welcomeModal = $('#welcome-modal');
var $EnterMap = $('#enter-map');
var $closeModalSpan = $('#close-modal-span')


// Show the modal on page load
$welcomeModal.fadeIn(200);


// Add event listener to the button to close the modal when clicked
$EnterMap.click(() => {
    $welcomeModal.fadeOut(200); // Close the modal with a fade-out effect
});


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
                    'color': 'white', // 文字颜色为白色
                    'transition-property': 'background-color, width, height', // 过渡属性
                    'transition-duration': '0.2s' // 过渡持续时间 0.2 秒
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 4,
                    'line-color': '#878787',
                    'target-arrow-color': '#878787',
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
                    'line-color': '#ffffff', // 设置红色
                    //'line-style': 'dashed', // 设置线条为虚线以模拟传输
                    'target-arrow-color': '#ffffff',
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
        },
        minZoom: 0.1,  // Minimum zoom level (25%)
        maxZoom: 4.0    // Maximum zoom level (400%)
    });

    // 模态框逻辑
    var $modalTitle = $('#modal-title');
    var $modalBody = $('#modal-body');

    var $innerH2Box = $('.inner-h2-box');
    var $courseContentBox = $('#course-content-box');

    // 当鼠标悬浮到节点上时，节点缓缓变大，并变为红色
    cy.on('mouseover', 'node', function (evt) {
        var node = evt.target;
        node.animate({
            style: {
                'background-color': '#00ffff', // 红色
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
    cy.on('tap', 'node', (evt) => {
        
        var node = evt.target;

        // Dynamically create the modal content based on node data
        let modalH2 = `<h2>${node.data('label')}</h2>`;
        let modalP = `<p>In this course you will learn about ${node.data('label')}.</p>`;

        $innerH2Box.html(modalH2);
        $courseContentBox.html(modalP);

        $courseBox.fadeIn(200); // Show the modal with a fade-in effect
        isCourseBoxOpen = true;
        // 在显示模态框后，短暂延迟再绑定 window 的点击事件，避免立即关闭
        setTimeout(() => {
            $(window).on('click.closeModal', (event) => {
                // 确保点击事件不在模态框内部触发关闭逻辑
                if (!$(event.target).closest('#course-box').length && !$(event.target).closest('.cytoscape-node').length) {
                    $courseBox.fadeOut(200); // 关闭模态框
                    isCourseBoxOpen = false;

                    // 解除 window 的 click 事件绑定，防止重复绑定
                    $(window).off('click.closeModal');
                }
            });
        }, 100); // 延迟100毫秒再绑定点击事件
    });

    // 点击 x 按钮关闭模态框
    $closeModalSpan.click(() => {
        $courseBox.fadeOut(200); // 200 毫秒的淡出动画
        isCourseBoxOpen = false;
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
        }, 5); // 每 5 毫秒更新一次
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

    // 用于存储已生成的纵坐标
    // 用于存储已生成的纵坐标
    const usedPositions = new Set();

    function createShapes() {
        const shapes = ['square', 'circle']; // 可选择的形状
        const newPositions = new Set(); // 当前轮次的新位置

        for (let i = 0; i < 5; i++) {
            const shape = document.createElement('div');
            shape.classList.add('geometric-shape', shapes[Math.floor(Math.random() * shapes.length)]);
            shape.style.width = `${Math.random() * 44 + 13}px`; // 随机宽度
            shape.style.height = shape.style.width; // 正方形

            let topPosition;
            // 确保新的纵坐标与已使用的纵坐标不重复
            do {
                topPosition = `${Math.random() * 100}vh`; // 随机高度
            } while (usedPositions.has(topPosition) || newPositions.has(topPosition));

            shape.style.top = topPosition;
            shape.style.left = '0vw'; // 从右边生成
            document.body.appendChild(shape);

            // 设置动画时长为超过10秒
            shape.style.animationDuration = `${Math.random() * 10 + 10}s`; // 每个正方形跨越整个屏幕的时间超过10秒

            // 添加当前的纵坐标到已使用的位置
            newPositions.add(topPosition);
        }

        // 更新已使用的位置集合
        usedPositions.clear(); // 清空之前的记录
        newPositions.forEach(pos => usedPositions.add(pos)); // 记录新生成的位置
    }


    // 在窗口大小变化时，重新创建图形
    window.addEventListener('resize', () => {
        // 清除当前的形状
        document.querySelectorAll('.geometric-shape').forEach(shape => shape.remove());
        // 重新生成形状
        createShapes();
    });
    createShapes();

}).fail(function (error) {
    console.error('Error loading elements:', error);
});


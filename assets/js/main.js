// 使用 cytoscape-dagre 插件
cytoscape.use(cytoscapeDagre);

// 使用 jQuery 的 $.getJSON 来加载 elements.json 文件
$.getJSON('elements.json', function (data) {
    // 创建 Cytoscape 图
    var cy = cytoscape({
        container: $('#cy')[0], // HTML 容器
        elements: [...data.nodes, ...data.edges], // 从 JSON 加载节点和边
        style: [
            { selector: 'node', style: { 'background-color': '#6fb1fc', 'label': 'data(label)' } },
            { selector: 'edge', style: { 'width': 4, 'line-color': '#ccc', 'target-arrow-color': '#ccc', 'target-arrow-shape': 'triangle' } }
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

    // 点击节点事件
    cy.on('tap', 'node', function (evt) {
        var node = evt.target;
        $modalTitle.text(node.data('label'));
        $modalBody.text('Information about ' + node.data('label'));
        $modal.show(); // 显示模态框
    });

    // 关闭模态框
    $span.on('click', function () {
        $modal.hide(); // 隐藏模态框
    });

    // 点击模态框外部关闭模态框
    $(window).on('click', function (event) {
        if ($(event.target).is($modal)) {
            $modal.hide(); // 点击外部时隐藏模态框
        }
    });
}).fail(function (error) {
    console.error('Error loading elements:', error);
});
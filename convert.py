import csv
import json
from tqdm import tqdm

def csv_to_json(csv_filename):
    nodes = []
    edges = []

    # 使用 utf-8-sig 编码读取文件，去除 BOM
    with open(csv_filename, 'r', encoding='utf-8-sig') as csvfile:
        reader = csv.DictReader(csvfile)
        
        for row in tqdm(reader):        
            # Node 添加节点
            nodes.append({
                "data": {
                    "id": row["id"].strip(),  # 处理列名中的空格
                    "label": row["label"].strip()  # 确保列值没有额外的空格
                }
            })
            

            # Edge 添加边 (connect to 和 from 中可能有多个节点，用;分隔)
            connect_to = row["connect to"].split(';')
            
            # 创建每个从 node 到 connect_to 的边
            for target_node in connect_to:
                if target_node.strip() != "None":  # 去除空格并检查 "None"
                    edges.append({
                        "data": {
                            "source": row["id"].strip(),
                            "target": target_node.strip()
                        }
                    })

    # 构建完整的 JSON 结构
    output_data = {
        "nodes": nodes,
        "edges": edges
    }

    return output_data


# 示例调用
csv_filename = "elements.csv"  # 替换为你的 .csv 文件路径
json_data = csv_to_json(csv_filename)

# 保存为 JSON 文件
with open("elements.json", "w") as jsonfile:
    json.dump(json_data, jsonfile, indent=4)


import csv
import requests
import json

API_URL = "http://localhost:3000/api/produto/create"  # altere conforme sua API

with open("dados/dados.csv", newline='', encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        data = {
            "nome": row["nome"],
            "descricao": row["descricao"],
            "imagemUrl": "",
            "ativo": row["ativo"].lower() == "true",
            "tipo": row["tipo"],
            "categoriaId": int(row["categoriaId"]),
        }


        response = requests.post(API_URL, json=data)
        if response.status_code == 201:
            print(f"✅ Produto criado: {data['nome']}")
        else:
            print(f"❌ Erro ({response.status_code}): {response.text}")

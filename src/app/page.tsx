"use client";

import type React from "react";
import { useState } from "react";
import dados, { TarefaInterface } from "@/data";
import Cabecalho from "@/componentes/Cabecalho";
import { useEffect } from "react";



// Componente de Tarefa
interface TarefaProps {
	titulo: string;
	concluido?: boolean;
}

const Tarefa: React.FC<TarefaProps> = ({ titulo, concluido }) => {
	const [estaConcluido, setEstaConcluido] = useState(concluido);

	const classeCard = `p-3 mb-3 rounded-lg shadow-md hover:cursor-pointer hover:border ${
		estaConcluido
			? "bg-gray-800 hover:border-gray-800"
			: "bg-gray-400 hover:border-gray-400"
	}`;

	const classeCorDoTexto = estaConcluido ? "text-amber-50" : "";

	const escutarClique = () => {
		console.log(`A tarefa '${titulo}' foi clicada!`);
		setEstaConcluido(!estaConcluido);
	};

	return (
		<div className={classeCard} onClick={escutarClique}>
			<h3 className={`text-xl font-bold ${classeCorDoTexto}`}>{titulo}</h3>
			<p className={`text-sm ${classeCorDoTexto}`}>
				{estaConcluido ? "Concluída" : "Pendente"}
			</p>
		</div>
	);
};

// Lista de Tarefas
interface TarefasProps {
	dados: TarefaInterface[];
}

const Tarefas: React.FC<TarefasProps> = ({ dados }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{dados.map((tarefa) => (
				<Tarefa
					key={tarefa.id}
					titulo={tarefa.title}
					concluido={tarefa.completed}
				/>
			))}
		</div>
	);
};

// Modal para adicionar nova tarefa
interface ModalTarefaProps {
	onAdicionar: (novaTarefa: string) => void;
	onFechar: () => void;
}

const ModalTarefa: React.FC<ModalTarefaProps> = ({ onAdicionar, onFechar }) => {
	const [novaTarefa, setNovaTarefa] = useState("");

	const handleAdicionar = () => {
		if (novaTarefa.trim()) {
			onAdicionar(novaTarefa.trim());
			onFechar();
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white text-black p-6 rounded-lg shadow-md w-96">
				<h2 className="text-xl font-bold mb-4">Nova Tarefa</h2>
				<input
					type="text"
					className="w-full p-2 border rounded mb-4"
					value={novaTarefa}
					onChange={(e) => setNovaTarefa(e.target.value)}
					placeholder="Digite o título da tarefa"
				/>
				<div className="flex justify-end gap-2">
					<button
						onClick={onFechar}
						className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
					>
						Cancelar
					</button>
					<button
						onClick={handleAdicionar}
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						Adicionar
					</button>
				</div>
			</div>
		</div>
	);
};

// Página principal
const Home = () => {
	const [tarefas, setTarefas] = useState<TarefaInterface[]>(() => {
		const tarefasSalvas = localStorage.getItem("tarefas");
		return tarefasSalvas ? JSON.parse(tarefasSalvas) : [];
	});
	
	useEffect(() => {
		localStorage.setItem("tarefas", JSON.stringify(tarefas));
	}, [tarefas]);
	
	
	const [mostrarModal, setMostrarModal] = useState(false);

	const adicionarTarefa = (titulo: string) => {
		const novaTarefa: TarefaInterface = {
			id: tarefas.length + 1,
			title: titulo,
			completed: false,
		};
		setTarefas((prev) => [...prev, novaTarefa]);
	};

	return (
		<div className="container mx-auto p-4">
			<Cabecalho />

			<button
				onClick={() => setMostrarModal(true)}
				className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
			>
				+ Nova Tarefa
			</button>

			<Tarefas dados={tarefas} />

			{mostrarModal && (
				<ModalTarefa
					onAdicionar={adicionarTarefa}
					onFechar={() => setMostrarModal(false)}
				/>
			)}
		</div>
	);
};

export default Home;

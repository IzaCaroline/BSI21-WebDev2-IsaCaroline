import { useEffect, useState, RefObject } from "react"
import Header from "./Header"
import Input from "./Input"
import List from "./List"
import './App.css'

export type TTodoRestItem = { id: number, text: string, date: string, ref: RefObject<HTMLLIElement> }

export default function App() {
    const [todolist, setTodolist] = useState<TTodoRestItem[]>(
        JSON.parse(localStorage.getItem('todolist') ?? '[]')
    )
    const [syncStateIcon, setSyncStateIcon] = useState('synced');

    useEffect(() => {
        fetch("http://localhost:3000/item")
            .then(response => response.json())
            .then(data => setTodolist(data))
    }, [])

    return <div className="app">
        <Header />
        <Input setTodolist={setTodolist} todolist={todolist} setSyncStateIcon={setSyncStateIcon} />
        <List setTodolist={setTodolist} todolist={todolist} />
    </div>
}
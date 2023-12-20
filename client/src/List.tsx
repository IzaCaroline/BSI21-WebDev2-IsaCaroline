import { KeyboardEvent, MouseEvent } from "react"
import { TTodoRestItem } from "./App"
import { format } from 'date-fns';


type TProps = {
  todolist: TTodoRestItem[],
  setTodolist: (todolist: TTodoRestItem[]) => void
}

export default function (props: TProps) {
  const { todolist, setTodolist } = props

  const removeItem = async (event: MouseEvent<HTMLButtonElement>) => {
    const id = Number(event.currentTarget.dataset.id) as number
    const li = event.currentTarget.closest('li') as HTMLLIElement
    li.className = 'pending'
    await fetch(`http://localhost:3000/item/${id}`, { method: 'DELETE' })
    const newTodolist = todolist.filter((val, _key) => val.id !== id)
    setTodolist(newTodolist)
  }

  const keyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const li = event.currentTarget.closest('li') as HTMLLIElement
      li.className = 'pending'
      const value = event.currentTarget.value
      const id = event.currentTarget.dataset.id
      const request = await fetch(`http://localhost:3000/item/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todo: value })
      })
      const response = await request.json()
      console.log(response)
      li.className = 'synced'
    }
  }

  return (
    <>
      <ul>
        {todolist.map((todo, _key) => {
          // Verifica se todo.date é uma string que pode ser convertida para um objeto Date
          if (isNaN(Date.parse(todo.date))) {
            return (
              <li ref={todo.ref} key={todo.id} data-id={todo.id} className={todo.id < 0 ? "pending" : "synced"}>
                <button data-id={todo.id} onClick={removeItem}>remove</button>
                <input data-id={todo.id} defaultValue={todo.text} onKeyDown={keyDown} />
                {/* Se todo.date não pode ser convertido para um objeto Date, exibe todo.date como está */}
                <span>{todo.date}</span>
              </li>
            );
          } else {
            // Converte a string da data para um objeto Date
            const todoDate = new Date(todo.date);

            // Formata a data usando o date-fns
            const formattedDate = format(todoDate, 'dd/MM - HH:mm');

            return (
              <li ref={todo.ref} key={todo.id} data-id={todo.id} className={todo.id < 0 ? "pending" : "synced"}>
                <button data-id={todo.id} onClick={removeItem}>remove</button>
                <input data-id={todo.id} defaultValue={todo.text} onKeyDown={keyDown} />
                {/* Exibe a data formatada */}
                <span>{formattedDate}</span>
              </li>
            );
          }
        })}
      </ul>
    </>
  );
}
import React, { KeyboardEvent, useState, createRef, ChangeEvent } from "react";
import { TTodoRestItem } from "./App";

type TProps = {
    todolist: TTodoRestItem[],
    setTodolist: (todolist: TTodoRestItem[]) => void,
    setSyncStateIcon: (syncStateIcon: string) => void
  }

export function Input (props: TProps) {
    const { todolist, setTodolist, setSyncStateIcon } = props;
    const [inputValue, setInputValue] = useState('');
    const [currentId, setCurrentId] = useState(1);

    async function updateTodoList() {
      await fetch("http://localhost:3000/item")
      .then(response => response.json())
      .then(data => setTodolist(data));
      setSyncStateIcon('synced');
    }

    async function createTodoItem(value: string) {
      await fetch("http://localhost:3000/item", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ todo: value })
        });
        updateTodoList();
    }

    const onKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && event.currentTarget.value !== '') {
            const value = event.currentTarget.value;
            event.currentTarget.value = '';
            try {
                setCurrentId(todolist[0].id);
            } catch {
                setCurrentId(1);
            }
            setSyncStateIcon('pending');

            const date = new Date();
            const formattedDate = `${date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} - ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

            const NewTodoList = [{ id: currentId, text: value, date: formattedDate, ref: createRef<HTMLLIElement>() }, ...todolist];

            createTodoItem(value);
            setTodolist(NewTodoList);
            setCurrentId(currentId + 1);
            console.log(todolist);
        }
    };

    return (
      <input className="input-action" type="text" placeholder="O que tem pra hoje?" onKeyDown={onKeyDown} />
    );
  }

export default Input;
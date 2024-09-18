import { NextResponse } from 'next/server';


let increID = 4;
const todos = [
  { id: "1", todo: "Basic Requirement", isCompleted: true, createdAt: new Date().toISOString() },
  { id: "2", todo: "Building more functionalities", isCompleted: true, createdAt: new Date().toISOString() },
  { id: "3", todo: "Building Simple CRUD APIs", isCompleted: true, createdAt: new Date().toISOString() },
];

export async function GET() {
  return NextResponse.json(todos);
} 

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.todo) {
      return NextResponse.json({ success: false, message: 'Todo cannot be empty' }, { status: 400 });
    }
    let newID = increID++
    const newTodo = {
      id: newID, 
      todo: data.todo,
      isCompleted: data.isCompleted,
      createdAt: new Date().toISOString(),
    };
    // todos.push(newTodo); 
    return NextResponse.json({ success: true, todo: newTodo }, { status: 201 });
  } catch (error) {
    console.error('Failed to create todo:', error);
    return NextResponse.json({ success: false, message: 'Failed to create todo' }, { status: 500 });
  }
}

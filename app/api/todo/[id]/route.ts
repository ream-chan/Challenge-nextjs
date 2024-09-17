import { NextRequest, NextResponse } from "next/server";


export function GET(request: NextRequest, { params }: { params: { id: string } }) {
    if (!params.id) {
        return NextResponse.json({ error: "Todo not Found" }, { status: 404 });
    }
    const todos = [
        { id: "1", todo: "Basic Requirement", isCompleted: true, createdAt: new Date().toISOString() },
        { id: "2", todo: "Building more functionalities", isCompleted: true, createdAt: new Date().toISOString() },
        { id: "3", todo: "Building Simple CRUD APIs", isCompleted: true, createdAt: new Date().toISOString() },
    ];
    
    const todo = todos.find(t => t.id === params.id);
    if (!todo) {
        return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    return NextResponse.json(todo);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
    const body = await request.json();
    if (!body.todo) {
        return NextResponse.json({ error: "Todo cannot be empty" }, { status: 400 });
    }
    return NextResponse.json({ id: params.id, todo: body.todo, isCompleted: true, createdAt: new Date().toISOString() });
    }
    catch(error){
            return NextResponse.json({ error: "Error Updating" }, { status: 404 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        if (!id) {
            return NextResponse.json({ error: "Todo ID not provided" }, { status: 400 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Error Deleting" }, { status: 500 });
    }
}
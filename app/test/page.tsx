function MyButton() {
    return (
        <button>
            I'm a button
        </button>
    );
}

export default function Test() {
    return (
        <div>
            <h1>This is a test</h1>
            <MyButton />
        </div>
    );
}
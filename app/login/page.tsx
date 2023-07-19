function MyButton() {
    return (
        <button>
            Login!
        </button>
    );
}

export default function Test() {
    return (
        <div>
            <h1>Login</h1>
            <p>Access with your user and password</p>
            <MyButton />
        </div>
    );
}
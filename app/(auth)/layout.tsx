const AuthLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="grid h-screen place-content-center">
            {children}
        </div>
    )
}

export default AuthLayout
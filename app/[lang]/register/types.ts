interface RegisterResult {
    success?: boolean
    errorType?: "invalid-password" | "invalid-email" | "email-exists" | "server-error"
}
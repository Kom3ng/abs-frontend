interface LoginResult{
    success?: boolean,
    errorType?: 'email-or-password-incorrect' | 'server-error' | 'turnslite-failed',
    data?: User
}
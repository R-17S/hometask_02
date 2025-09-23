export const emailTemplates = {
    registrationEmail: (code: string) => `
    <h1>Спасибо за регистрацию!</h1>
    <p>Для завершения регистрации перейдите по ссылке:</p>
    <a href="https://your-front.com/confirm-registration?code=${code}">
      Подтвердить email
    </a>
    <p>Код действителен 24 часа</p>
  `,
    resendConfirmationEmail: (code: string) => `
    <h1>Новый код подтверждения</h1>
    <p>Для завершения регистрации перейдите по ссылке:</p>
    <a href="https://your-front.com/confirm-registration?code=${code}">
      Подтвердить email
    </a>
    <p>Код действителен 24 часа</p>
  `,
    recoveryPassword: (code: string) => `
      <h1>Password recovery</h1>
      <p>To finish password recovery please follow the link below:
        <a href="https://your-front.com/confirm-registration?recoveryCode=${code}">Recover password</a>
      </p>
    `
};

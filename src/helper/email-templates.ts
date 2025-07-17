export const emailExamples = {
    registrationEmail: `
        <h1>Спасибо за регистрацию!</h1>
        <p>Для завершения регистрации перейдите по ссылке:</p>
        <a href="https://your-front.com/confirm-registration?code={{code}}">
            Подтвердить email
        </a>
        <p>Код действителен 24 часа</p>
    `,
    resendConfirmationEmail: `
    <h1>Новый код подтверждения</h1>
    <p>Для завершения регистрации перейдите по ссылке:</p>
    <a href="https://your-front.com/confirm-registration?code={{code}}">
      Подтвердить email
    </a>
    <p>Код действителен 24 часа</p>
  `
};

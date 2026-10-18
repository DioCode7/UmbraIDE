# Imports
from fastapi import FastAPI
import secrets
import os
from dotenv import load_dotenv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
# Configuração do e-mail (Office365 usa STARTTLS)

load_dotenv()


SendgridApiKey = os.getenv("SendGridApiKey")
SendGridFromEmail = os.getenv("EmailDomain")



def EmailVerificationGenerator():
    return ''.join(str(secrets.randbelow(10))for _ in range(6))





def EmailVerificationEnv(Email: str,Code:str):
    html = f"""
    <html>
      <body style="margin:0; padding:0; background-color:#111111; font-family:Arial, sans-serif;">
        <div style="width:100%; height:100vh; display:flex; align-items:center; justify-content:center;">
          <div style="background-color:#000000; border:2px solid orangered; border-radius:12px; padding:40px; margin: 5vh auto; text-align:center; max-width:500px;">
            
            <h1 style="color:white; font-size:36px; margin-bottom:20px;">Nexra</h1>
            
            <p style="color:white; font-size:18px; margin:10px 0;">
              Aqui está seu código de verificação:
            </p>
            
            <p style="color:orangered; font-size:28px; font-weight:bold; margin:20px 0;">
              {Code}
            </p>

            <p style="color:#999999; font-size:14px;">
              Caso não tenha solicitado, ignore este e-mail.
            </p>
          </div>
        </div>
      </body>
    </html>
    """

    Message = Mail(
        from_email=SendGridFromEmail,
        to_emails=Email,
        subject='Bem-vindo ao Nexra!',
        html_content=html,
        plain_text_content=f"Bem-vindo ao Nexra! Seu código de verificação é: {Code}"
    )

    try:
        sg = SendGridAPIClient(SendgridApiKey)
        response = sg.send(Message)
        print(f"Status: {response.status_code}")
        return True
    except Exception as e:
        print(f"Erro ao enviar email: {e}")
        return False

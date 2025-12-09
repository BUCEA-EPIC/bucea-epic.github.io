import smtplib
from email.mime.text import MIMEText
from app.core.config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TO_EMAIL, logger

def send_contact_email(name: str, email: str, message: str):
    try:
        msg = MIMEText(f"姓名: {name}\n邮箱: {email}\n\n{message}", 'plain', 'utf-8')
        msg["Subject"] = f"网站留言: {name}"
        msg["From"] = SMTP_USER
        msg["To"] = TO_EMAIL
        msg["Reply-To"] = email

        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)
        return True
    except Exception as e:
        logger.error(f"邮件失败: {e}")
        raise e
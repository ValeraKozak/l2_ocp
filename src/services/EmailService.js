import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class EmailService {
  async sendRegistrationConfirmation(user) {
    const transport = this.createTransport();
    const registeredAt = new Intl.DateTimeFormat("uk-UA", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date());
    const safeName = this.escapeHtml(user.fullName);
    const safeEmail = this.escapeHtml(user.email);

    const mail = {
      from: process.env.SMTP_FROM || "velocity@example.com",
      to: user.email,
      subject: "Підтвердження реєстрації у VeloCity Store",
      text: [
        `Вітаємо, ${user.fullName}!`,
        "",
        "Реєстрацію у VeloCity Store успішно завершено.",
        `Email акаунта: ${user.email}`,
        `Дата реєстрації: ${registeredAt}`,
        "",
        "Тепер ви можете оформлювати замовлення на звичайні та електричні велосипеди.",
        "",
        "Дякуємо, що обрали VeloCity Store."
      ].join("\n"),
      html: `
        <div style="margin:0;padding:24px 0;background-color:#f4efe6;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" style="max-width:640px;background:#fffdf9;border-radius:24px;overflow:hidden;border:1px solid #dfd2bf;font-family:Georgia,'Times New Roman',serif;color:#1f2933;">
                  <tr>
                    <td style="padding:0;background:linear-gradient(135deg,#1f6f5f 0%,#2b8a78 100%);">
                      <div style="padding:32px 36px 28px;color:#ffffff;">
                        <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:0.85;margin-bottom:14px;">VeloCity Store</div>
                        <h1 style="margin:0;font-size:34px;line-height:1.15;font-weight:700;">Реєстрацію підтверджено</h1>
                        <p style="margin:14px 0 0;font-size:16px;line-height:1.7;max-width:440px;">
                          Ваш акаунт активовано, і тепер ви можете оформлювати замовлення на звичайні та електричні велосипеди.
                        </p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:34px 36px 18px;">
                      <p style="margin:0 0 18px;font-size:20px;line-height:1.6;">
                        Вітаємо, <strong>${safeName}</strong>!
                      </p>
                      <p style="margin:0 0 20px;font-size:16px;line-height:1.8;color:#34424f;">
                        Дякуємо за реєстрацію у <strong>VeloCity Store</strong>. Ми підготували для вас зручний сервіс для вибору велосипеда, оформлення замовлення та подальшого супроводу покупки.
                      </p>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;background:#f8f4ec;border:1px solid #e8dccb;border-radius:18px;">
                        <tr>
                          <td style="padding:20px 22px;">
                            <div style="font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Дані реєстрації</div>
                            <p style="margin:0 0 10px;font-size:15px;line-height:1.7;"><strong>Ім'я:</strong> ${safeName}</p>
                            <p style="margin:0 0 10px;font-size:15px;line-height:1.7;"><strong>Email:</strong> ${safeEmail}</p>
                            <p style="margin:0;font-size:15px;line-height:1.7;"><strong>Дата:</strong> ${registeredAt}</p>
                          </td>
                        </tr>
                      </table>
                      <div style="margin:0 0 28px;padding:18px 20px;background:#dff0ea;border-radius:18px;border-left:5px solid #1f6f5f;">
                        <p style="margin:0;font-size:15px;line-height:1.8;color:#1e4d43;">
                          Наступний крок: увійдіть на сайт і оформіть замовлення на модель, яка вам підходить найбільше.
                        </p>
                      </div>
                      <p style="margin:0 0 8px;font-size:16px;line-height:1.8;">З повагою,</p>
                      <p style="margin:0;font-size:18px;line-height:1.6;font-weight:700;color:#1f6f5f;">Команда VeloCity Store</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:20px 36px 30px;background:#fbf7f0;border-top:1px solid #eadfce;">
                      <p style="margin:0;font-size:13px;line-height:1.8;color:#6b7280;">
                        Це автоматичний лист-підтвердження реєстрації. Якщо ви не створювали акаунт у VeloCity Store, просто проігноруйте це повідомлення.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      `
    };

    const result = await transport.sendMail(mail);

    if (result.message) {
      const previewFile = await this.storePreview(user.email, result.message.toString());
      return { delivered: false, previewFile };
    }

    return { delivered: true, previewFile: null };
  }

  createTransport() {
    if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: process.env.SMTP_USER
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS
            }
          : undefined
      });
    }

    return nodemailer.createTransport({
      streamTransport: true,
      buffer: true,
      newline: "unix"
    });
  }

  async storePreview(email, message) {
    const previewsDir = path.resolve(__dirname, "..", "..", "sent-emails");
    await fs.mkdir(previewsDir, { recursive: true });

    const safeEmail = email.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const filename = `${Date.now()}_${safeEmail}.eml`;
    const filePath = path.join(previewsDir, filename);

    await fs.writeFile(filePath, message, "utf-8");
    return filePath;
  }

  escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
}

interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  name,
  email,
  message,
}) => {
  return (
    <div>
      {/* ヘッダー */}
      <div
        style={{
          textAlign: "center",
          borderBottom: "2px solid #e0e0e0",
          paddingBottom: "20px",
        }}
      >
        <h1
          style={{
            margin: "0",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          お問い合わせありがとうございます
        </h1>
      </div>

      {/* メインコンテンツ */}
      <div>
        <p
          style={{
            fontSize: "18px",
            marginBottom: "20px",
            fontWeight: "500",
          }}
        >
          {name}様
        </p>

        <p
          style={{
            fontSize: "16px",
            marginBottom: "20px",
          }}
        >
          この度は、お問い合わせいただきありがとうございます。
          <br />
          以下の内容でお問い合わせを受け付けいたしました。
        </p>

        {/* お問い合わせ内容 */}
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "2px solid #e0e0e0",
          }}
        >
          <h2
            style={{
              margin: "0 0 25px 0",
              fontSize: "20px",
              fontWeight: "bold",
              paddingBottom: "10px",
            }}
          >
            お問い合わせ内容
          </h2>

          <div style={{ marginBottom: "20px" }}>
            <strong>お名前：</strong>
            <br />
            {name}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <strong>メールアドレス：</strong>
            <br />
            {email}
          </div>

          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <strong>メッセージ：</strong>
            <br />
            {message}
          </div>
        </div>

        <p
          style={{
            fontSize: "14px",
            margin: "0",
            paddingBottom: "20px",
          }}
        >
          このメールはお問い合わせフォームから自動送信されています。
          <br />
          ご不明な点がございましたら、お気軽にお問い合わせください。
        </p>
      </div>

      {/* フッター */}
      <div
        style={{
          padding: "20px",
          borderTop: "2px solid #e0e0e0",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: "0",
            fontSize: "14px",
          }}
        >
          © 2025 SnipHub. All rights reserved.
        </p>
      </div>
    </div>
  );
};

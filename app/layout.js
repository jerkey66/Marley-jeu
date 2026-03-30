export const metadata = {
  title: "Jeu anniversaire Marley",
  description: "Défi rugby",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

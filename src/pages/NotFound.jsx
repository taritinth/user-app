import Container from "../components/core/Container";

function NotFoundPage() {
  return (
    <Container>
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold text-indigo-600 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Oh no, we couldn&apos;t find that page!
        </h2>
      </div>
    </Container>
  );
}

export default NotFoundPage;

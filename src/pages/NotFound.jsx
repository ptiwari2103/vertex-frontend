const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
            <p className="text-gray-600 mt-4">Oops! The page you're looking for doesn't exist.</p>
            <a href="/" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md">Go Back Home</a>
        </div>
    );
};

export default NotFound;

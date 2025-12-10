import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold text-gray-800">
                            Logo
                        </Link>
                    </div>
                    
                    <div className="flex space-x-8">
                        <Link href="/" className="text-gray-600 hover:text-gray-900 transition duration-200">
                            Home
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
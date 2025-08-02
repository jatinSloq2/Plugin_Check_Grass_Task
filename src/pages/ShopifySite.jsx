import { useEffect, useState } from 'react';

export default function ShopifySites() {
    const [shop, setShop] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const s = params.get('shop');
        if (s) setShop(s);
    }, []);

    return (
        <div>
            <h1>Welcome to Dashboard</h1>
            <p>Store: {shop}</p>
        </div>
    );
}
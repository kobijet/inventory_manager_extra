const InventoryItem = ({item}) => {
    return (
        <div className="item">
            <p className="short-field">{item.id}</p>
            <p className="long-field">{item.name}</p>
            <p className="long-field">{item.category}</p>
            <p className="short-field">{item.qtyres}</p>
            <p className="short-field">{item.qty}</p>
            <p className="short-field">${item.price}/ea.</p>
        </div>
    );
}

export default InventoryItem;

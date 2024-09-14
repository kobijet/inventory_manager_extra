const InventoryItem = ({item}) => {
    return (
        <>
            <p className="item-id">{item.id}</p>
            <div className="long-field">
                <p>{item.name}</p>
                <p>{item.category}</p>
            </div>
            <div className="short-field">
                <p>{item.qtyres}</p>
                <p>{item.qty}</p>
            </div>
            <p className="short-field">${item.price}/ea.</p>
        </>
    );
}

export default InventoryItem;

const InventoryEditItem = ({item}) => {
    return (
        <>
            <p className="item-id">{item.id}</p>
            <div className="short-field">
                <p><input type="text" defaultValue={String(item.name)} onChange={setName}/></p>
                <p><input type="text" defaultValue={String(item.category)} onChange={setCateogry}/></p>
            </div>
            <div className="short-field">
                <p><input type="text" defaultValue={item.qtyres} onChange={setQtyres}/></p>
                <p><input type="text" defaultValue={item.qty} onChange={setQty}/></p>
            </div>
            <p className="short-field">$<input type="number" step="0.01" defaultValue={String(item.price)} onChange={setPrice}/>/ea.</p>
        </>
    );
}

export default InventoryEditItem;

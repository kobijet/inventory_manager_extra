const KPIComponent = ({name, value}) => {
    return (
        <div className="kpi-component">
            <p>{name}</p>
            <p>{value}</p>
        </div>
    );
}

export default KPIComponent;

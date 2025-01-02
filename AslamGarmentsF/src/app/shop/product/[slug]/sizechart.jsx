import "./style.css"


export default function SizeChart({ product }) {
    const attributes = [
        { key: "shoulder", label: "Shoulder" },
        { key: "chest", label: "Chest" },
        { key: "top_length", label: "Top Length" },
        { key: "sleeve_length", label: "Sleeve Length" },
        { key: "waist", label: "Waist" },
        { key: "hip", label: "Hip" },
        { key: "pant_length", label: "Pant Length" },
        { key: "thigh", label: "Thigh" },
        { key: "bust", label: "Bust" },
        { key: "inseam_length", label: "Inseam Length" },
        { key: "knee_circumference", label: "Knee Circumference" },
        { key: "ankle_circumference", label: "Ankle Circumference" },
        { key: "dress_length", label: "Dress Length" },
        { key: "shoulder_to_hip", label: "Shoulder to Hip" },
        { key: "shoulder_to_knee", label: "Shoulder to Knee" },
        { key: "shoulder_to_waist", label: "Shoulder to Waist" },
        { key: "shoulder_to_ankle", label: "Shoulder to Ankle" },
        { key: "neck_circumference", label: "Neck Circumference" },
    ];

    // Filter attributes to exclude rows where all values are null or undefined
    const filteredAttributes = attributes.filter(attr =>
        product.avail_size && product.avail_size.some(size => size[attr.key] !== null && size[attr.key] !== undefined)
    );

    return (
        <div className="max-h-[500px] overflow-y-scroll mb-14 no-scrollbar">
            <h3 className="review__form-title">Size Chart</h3>
            <table className="info__table mb-5">
                <thead>
                    <tr>
                        <th>Attribute</th>
                        {product.avail_size && product.avail_size.map((size, index) => (
                            <th key={index}>{size.size}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="h-10 overflow-scroll">
                    {filteredAttributes.map(attr => (
                        <tr key={attr.key}>
                            <td>{attr.label}</td>
                            {product.avail_size && product.avail_size.map((size, index) => (
                                <td key={index}>
                                    {size[attr.key] !== null && size[attr.key] !== undefined
                                        ? `${size[attr.key]}"` // Display value
                                        : "N/A"} 
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

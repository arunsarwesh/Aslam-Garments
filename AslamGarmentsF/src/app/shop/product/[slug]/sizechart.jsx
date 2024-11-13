export default function SizeChart({product}) {
    return (
        <div>
            <h3 className="review__form-title">Size Chart</h3>
            <table className="info__table mb-14">
                <thead>
                    <tr>
                        <th>Attribute</th>
                        {product.sizes.map((size, index) => (
                            <th key={index}>{size.size}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Shoulder</td>
                        {product.sizes.map((size, index) => (
                            <td key={index}>{size.shoulder}</td>
                        ))}
                    </tr>
                    <tr>
                        <td>Chest</td>
                        {product.sizes.map((size, index) => (
                            <td key={index}>{size.chest}</td>
                        ))}
                    </tr>
                    <tr>
                        <td>Top Length</td>
                        {product.sizes.map((size, index) => (
                            <td key={index}>{size.top_length}</td>
                        ))}
                    </tr>
                    <tr>
                        <td>Sleeve Length</td>
                        {product.sizes.map((size, index) => (
                            <td key={index}>{size.sleev_length}</td>
                        ))}
                    </tr>
                    <tr>
                        <td>Waist</td>
                        {product.sizes.map((size, index) => (
                            <td key={index}>{size.waist}</td>
                        ))}
                    </tr>
                    <tr>
                        <td>Hip</td>
                        {product.sizes.map((size, index) => (
                            <td key={index}>{size.hip}</td>
                        ))}
                    </tr>
                    <tr>
                        <td>Pant Length</td>
                        {product.sizes.map((size, index) => (
                            <td key={index}>{size.pant_length}</td>
                        ))}
                    </tr>
                    <tr>
                        <td>Thigh</td>
                        {product.sizes.map((size, index) => (
                            <td key={index}>{size.thigh}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>

    )
}
export default function AddInfoTab({ product }) {
    return (
        <table className="info__table">
            <tbody>
                <tr>
                    <th>SKU</th>
                    <td>{product.SKU}</td>
                </tr>
                <tr>
                    <th>Name</th>
                    <td>{product.name}</td>
                </tr>
                <tr>
                    <th>Description</th>
                    <td>{product.description}</td>
                </tr>
                <tr>
                    <th>Stock</th>
                    <td>{product.stock}</td>
                </tr>
                <tr>
                    <th>Market Price</th>
                    <td>₹{product.market_price}</td>
                </tr>
                <tr>
                    <th>Selling Price</th>
                    <td>₹{product.selling_price}</td>
                </tr>
                <tr>
                    <th>GSM</th>
                    <td>{product.gsm}</td>
                </tr>
                <tr>
                    <th>Fabric</th>
                    <td>{product.fabric.join(', ')}</td>
                </tr>
                <tr>
                    <th>Product Type</th>
                    <td>{product.product_type}</td>
                </tr>
                <tr>
                    <th>Sleeve</th>
                    <td>{product.sleeve}</td>
                </tr>
                <tr>
                    <th>Fit</th>
                    <td>{product.fit}</td>
                </tr>
                <tr>
                    <th>Ideal For</th>
                    <td>{product.ideal_for}</td>
                </tr>
                <tr>
                    <th>Net Weight</th>
                    <td>{product.net_weight} g</td>
                </tr>
                {/* <tr>
                    <th>Colors</th>
                    <td>{product.colors.map(color => color.color).join(', ')}</td>
                </tr> */}
                <tr>
                    <th>Sizes</th>
                    <td>{product.avail_size.map(size => size.size).join(', ')}</td>
                </tr>
                <tr>
                    <th>Tags</th>
                    <td>{product.tags.join(', ')}</td>
                </tr>
            </tbody>
        </table>
    )
}
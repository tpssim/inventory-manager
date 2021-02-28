import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

function ProductRow({ product, availability }) {

    return(
        <tr>
            <td>{product.id}</td>
            <td>{product.name}</td>
            <td>{product.manufacturer}</td>
            <td>{product.color}</td>
            <td>{product.price}</td>
            <td>
                {availability.status}
                {availability.loading ? <Spinner animation="border" size="sm"/> : <></>}
            </td>
        </tr>
    );
}

export default ProductRow;
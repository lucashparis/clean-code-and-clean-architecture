import express, { Request, Response } from "express";
import { validate } from "./validator";
import { Products } from "../fakeDB/Products";

const app = express();
app.use(express.json());

app.post("/checkout", function(req: Request, res: Response) {
    const output: Output = {
        total: 0
    };
    
    if (req.body.items) {
        for (const item of req.body.items) {
            let product = Products.find(el => el.idProduct === item.idProduct);
            output.total += product?.price ? (item.quantity * product?.price) : 0;
        }
    }

    if (req.body.cupom) {
        output.total -= (req.body.cupom.value / 100) * output.total;
    }

    const isValid = validate(req.body.cpf);
    if (!isValid) output.message = "Invalid cpf";
    res.json(output);    
});

type Output = {
    message?: string
    total: number
}

app.listen(3000);
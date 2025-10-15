import { Controllers } from "@/controllers";
import { Container } from "inversify";
import { ControllerTokens } from "./tokens.di-container";

export const registerControllers = (container: Container) => {
    container.bind<Controllers.CarSale.User.Instance>(ControllerTokens.carSaleUser)
        .to(Controllers.CarSale.User.Instance)
}
import {IncomingMessage, ServerResponse} from "http";
import {GetServerSidePropsContext} from "next";

type MiddlewareArgs = IncomingMessage[] | ServerResponse[] | GetServerSidePropsContext[];

export { MiddlewareArgs }

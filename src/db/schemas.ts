import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import {Event} from "../types.ts"

export type EventSchema = Omit<Event, "id"> & {_id:ObjectId}
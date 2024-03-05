import { model, Schema } from "mongoose";
import ivrFlowUITypes from "../types/ivrFlowUITypes";

const IvrFlowUI: Schema = new Schema({
  name: {
    type: String,
    required: false,
  },
  auth_id: {
    type: String,
    required: false,
  },
  number: {
    type: String,
    required: false,
  },
  lastCalledNumber: {
    type: String,
    required: false,
  },
  active: {
    type: Boolean,
    required: false,
    default: true,
  },
  haveCredits: {
    type: Boolean,
    required: false,
    default: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
  variables: [
    {
      key: {
        type: String,
        required: false,
      },
      value: {
        type: String,
        required: false,
      },
    },
  ],
  input: [
    {
      data: {
        type: Schema.Types.Mixed,
        required: false,
      },
      id: {
        type: String,
        required: false,
      },
      position: {
        x: {
          type: String,
          required: false,
        },
        y: {
          type: String,
          required: false,
        },
      },
      type: {
        type: String,
        required: false,
      },
      record: {
        type: Boolean,
        required: false,
      },
      animated: {
        type: Boolean,
        required: false,
      },
      source: {
        type: String,
        required: false,
      },
      sourceHandle: {
        type: String,
        required: false,
      },
      style: {
        stroke: {
          type: String,
          required: false,
        },
      },
      target: {
        type: String,
        required: false,
      },
      targetHandler: {
        type: String,
        required: false,
      },
      x: {
        type: Schema.Types.Mixed,
        required: false,
      },
      y: {
        type: Schema.Types.Mixed,
        required: false,
      },
      zoom: {
        type: Schema.Types.Mixed,
        required: false,
      },
      origin: {
        type: Schema.Types.Mixed,
        required: false,
      },
      width: {
        type: Schema.Types.Mixed,
        required: false,
      },
      height: {
        type: Schema.Types.Mixed,
        required: false,
      },
      positionAbsolute: {
        type: Schema.Types.Mixed,
        required: false,
      },
      dragging: {
        type: Schema.Types.Mixed,
        required: false,
      },
      selected: {
        type: Schema.Types.Mixed,
        required: false,
      },
    },
  ],
  viewport: {
    type: Schema.Types.Mixed,
    required: false,
  }
});

export default model<ivrFlowUITypes>("ivrFlowUI", IvrFlowUI);

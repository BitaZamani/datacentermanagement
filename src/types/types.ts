
import type { ReactNode } from "react";

export type InputProps = {
  label: string;
  type: string;

  name: string;
};

export type AuthInitialState = {
  loading: boolean;
  user: {
    name: string | null;
    email: string | null;
    uid: string | null;
  };
  loginError: string;
  logoutError: string;
  registerError: string;
};

export type LoginProps = {
  email: string;
  password: string;
};
export type RegisterProps = LoginProps & {
  name: string;
};
export type DataCenterType = {
  id: string;
  name: string;
  description: null | string;
};
export type RackType = {
  id: string;
  name: string;
  description: null | string;
  dataCenterID: string;
  dataCenterName: string;
};

export type DBInitialState = {
  dataCenter: DataCenterType;
  dataCenters: DataCenterType[];
  rack: RackType;
  racks: RackType[];
  loading: boolean;
  error: string;
  dataCenterError: string;
  rackError: string;
};
export type InteractionInitialState = {
  openRackModal: boolean;
  openDataCenterModal: boolean;
  menuKey: "dashboard" | "datacenters" | "racks";
};
export type ModalsProps = {
  children: ReactNode;
  open: boolean;
  okText: string;
  form: string;
  onCancel: () => void;
};

export type StaticsInitialState = {
  racksCount: number | null;
  dataCentersCount: number | null;
  loading: boolean;
};

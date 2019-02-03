// webpack.DefinePlugin 読み込み用
declare const CONFIG: {
  [key: string]: any;
};

const _CONFIG = CONFIG;

export { _CONFIG as CONFIG };

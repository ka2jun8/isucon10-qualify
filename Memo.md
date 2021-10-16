ISUCON やったこと

- SSH 接続/ログイン
  - ssh -i ~/.ssh/aws-isucon-10-qualify.pem ubuntu@52.199.186.57
  - sudo -i -u isucon

- zsh/oh-my-zsh
  - sudo apt-get install zsh
  - chsh -s $(which zsh)
  - sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

- system の確認/起動
  - systemctl list-unit-files --type=service | grep isuumo
  - sudo systemctl status isuumo.nodejs.service
  - sudo systemctl enable isuumo.nodejs.service
  - sudo systemctl start isuumo.nodejs.service

- git の設定
  - git init
  - git remote add origin https://github.com/ka2jun8/isucon10-qualify

- mysql にログインして schema を確認
  - mysql -u isucon -p -h 127.0.0.1 -P 3306 isuumo
  - show columns from estate;
  - show index from estate;
  - SELECT table_schema, table_name, index_name, column_name, seq_in_index FROM information_schema.statistics WHERE table_schema = "isuumo";

- index 付与
  - explain
    - EXPLAIN SELECT * FROM estate ORDER BY rent ASC, id ASC LIMIT 20;
  - ALTER TABLE estate ADD INDEX rent_index(rent);
  - DROP INDEX price_stock_index ON chair;

- alp を使う
  - https://nishinatoshiharu.com/install-alp-to-nginx/
  - nginx へ ltsv log の追加
  - alp -f /var/log/nginx/access.log --cnt -r | head -n 10

- プロセスの確認
  - top

- mysql slow query を使う
  - https://masayuki14.hatenablog.com/entry/20120704/1341360260
  ```
  [mysqld]
    character-set-server=utf8mb4
    slow_query_log = 1
    slow_query_log_file = /var/log/mysql/slow.log
    long_query_time = 0
    [mysql]
    default-character-set=utf8mb4
    [client]
    default-character-set=utf8mb4
  ```
  - sudo mysqldumpslow -s t /var/log/mysql/slow.log

- typescript 化
  - https://github.com/ka2jun8/isucon10-qualify/pull/1/files
  - npx tsc --init
    - strict: false
    - outDir: dist
    - rootDir ./src
    - allowJs: true
  - npm i -D typescript @types/xxx
    - require を import に置換
    - vim
      - %s/const\s\+\(\S\+\)\s\+=\s\+require(\(.\+\))/import \1 from \2/gc

- try.sh の作成
  ```
    #!/bin/sh

    cd webapp/nodejs/
    npm i --no-save
    npm run build
    sudo systemctl restart isuumo.nodejs.service
    cd ../../bench
    ./bench
  ``` 

- 直列→並列実行
  - Promise.all を使う

- インメモリキャッシュを使う
  - https://github.com/ka2jun8/isucon10-qualify/pull/4


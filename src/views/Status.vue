<template>
  <div>
    <v-container fluid>
      <v-row align="center">
        <v-col class="d-flex" sm="2">
          <v-select :items="clusters" item-value="id" item-text="name" label="选择集群" solo v-model="clusterid"></v-select>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid>
      <v-row align="center">
        <v-col class="d-flex" sm="2" v-if="cluster != null">
          <v-card :loading="loading" class="mx-auto my-12">
            <v-card-title>{{cluster.name}}</v-card-title>
            <v-card-text>
              <div>{{cluster.desc}}</div>
            </v-card-text>
            <v-divider class="mx-4"></v-divider>
            <v-card-title>注册中心</v-card-title>
            <v-card-text> {{cluster.register}} </v-card-text>
            <v-card-title>在线服务数量 </v-card-title>
            <v-card-text> {{cluster.servers}} </v-card-text>
            <v-card-text>
              <v-row align="center">
                <block v-for="(v,k) in cluster.status">
                  <v-chip class="ma-2"  :color="v.color" outlined >
                    {{v.name}}
                  </v-chip>
                </block>
              </v-row>
            </v-card-text>
            <v-card-text>
              <v-chip-group v-model="selection" active-class="deep-purple accent-4 white--text" column>
              </v-chip-group>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col class="d-flex" sm="2" v-if="cluster != null">
          LOADING
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
export default {
  data: () => ({
    clusters: [
      { id: 1222, name: '集群dev' },
      { id: 1223, name: '集群2' },
      { id: 1224, name: '线上环境' },
      { id: 1225, name: '测试环境' },
    ],
    cluster: {
      name: "测试环境",
      desc: "描述1111111",
      register: "etcd://127.0.0.1/mconfig",
      servers: 100,
      status: [
        { name: "正常", color: "green" },
        { name: "平稳", color: "orange" },
        { name: "高可用", color: "red" },
        { name: "高可用", color: "yellow" },
        { name: "高可用", color: "green" },
        { name: "高可用", color: "red" },
        { name: "高可用", color: "primary" },
      ]

    },
    clusterid: 0,
  }),
}

</script>

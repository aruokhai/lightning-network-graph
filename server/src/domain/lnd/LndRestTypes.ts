// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Lnd {
    export interface Graph {
        // Exercise: define the `nodes` and `edges` properties in this interface.
        // These arrays of LightningNode and ChannelEdge objects.
        nodes: LightningNode[],
        edges: ChannelEdge[],
    }

    export interface LightningNode {
        last_update: number;
        pub_key: string;
        alias: string;
        addresses: NodeAddress[];
        color: string;
        features: FeatureMap;
    }

    export interface FeatureMap {
        [key: string]: Feature;
    }

    export interface Feature {
        name: string;
        is_required: boolean;
        is_known: boolean;
    }

    export interface NodeAddress {
        network: string;
        addr: string;
    }

    export interface ChannelEdge {
        channel_id: string;
        chan_point: string;
        last_update: string;
        node1_pub: string;
        node2_pub: string;
        capacity: string;
        node1_policy: RoutingPolicy;
        node2_policy: RoutingPolicy;
    }

    export interface RoutingPolicy {
        time_lock_delta: number;
        min_htlc: string;
        fee_base_msat: string;
        fee_rate_milli_msat: string;
        disabled: boolean;
        max_htlc_msat: string;
        last_update: number;
    }

    export interface GraphUpdate {
        result: {
            node_updates: NodeUpdate[];
            channel_updates: ChannelEdgeUpdate[];
            closed_chans: ClosedChannelUpdate[];
        };
    }

    export interface NodeUpdate {
        identity_key: string;
        global_features: number;
        alias: string;
        color: string;
        node_addresses: NodeAddress[];
        features: FeatureMap;
    }

    export interface ChannelEdgeUpdate {
        chan_id: string;
        chan_point: ChannelPoint;
        capacity: string;
        routing_policy: RoutingPolicy;
        advertising_node: string;
        connecting_node: string;
    }

    export interface ChannelPoint {
        funding_txid_bytes: string;
        funding_txid_str: string;
        output_index: number;
    }

    export interface ClosedChannelUpdate {
        chan_id: string;
        capacity: string;
        closed_height: number;
        chan_point: ChannelPoint;
    }
}

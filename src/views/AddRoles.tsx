import * as React from 'react';

const AddRoles: React.FunctionComponent = () => {
    const permissions = [
        "r:product",
        "c:product",
        "u:product",
        "d:product",
        "r:product-category",
        "c:product-category",
        "u:product-category",
        "d:product-category",
        "r:country",
        "c:country",
        "u:country",
        "d:country",
        "r:tax",
        "c:tax",
        "u:tax",
        "d:tax",
        "r:tax_rule",
        "c:tax_rule",
        "u:tax_rule",
        "d:tax_rule",
        "r:tax_rule_group",
        "c:tax_rule_group",
        "u:tax_rule_group",
        "d:tax_rule_group",
        "r:user",
        "c:user",
        "u:user",
        "d:user",
        "r:file",
        "c:file",
        "u:file",
        "d:file",
        "r:role",
        "c:role",
        "u:role",
        "d:role"
    ]
    const perms = {};
    permissions.forEach(item => {
        const [operation, entity] = item.split(':');
        if (!perms[entity]) perms[entity] = []
        let name = null
        switch(operation) {
            case 'r':
                name = "read"
                break
            case 'c':
                name = "create"
                break
            case 'u':
                name = "update"
                break
            case 'd':
                name = "delete"
                break
            default:
                break
        }
        perms[entity].push({
            value: item,
            title: entity,
            name: name
        });
    });

  return <form>
    <div>
        <label>Role's name</label>
        <br/>
        <input type="text" id="name" name="name" required></input>
        <div className="AddWrap">
        {
            Object.entries(perms).map(([title, arr]) => {
                return (<>
                <h3>{title}</h3>
                <div className="attrs">
                    {  
                       Object.values(arr).map((perm) => {
                           return ( <div className="checkBox">
                                <input type="checkbox" id={perm.value} name={perm.value}></input>
                                <label>{perm.name}</label>
                           </div>)
                       }) 
                    }
                </div>
                  </>
                )
            })
        }
        </div> 
        <div>
            <button type="submit" className="action">Soumettre</button>
        </div>
    </div>
  </form>
};

export default AddRoles;
